# Frontend behaviour spec for the route-call management UI (Phase 7).
# Written in English (Gherkin), UI texts are Spanish in the app.
# These scenarios are the reference for the Vitest + Testing Library tests
# of the new actions (edit / cancel / delete). Backend rules mirror
# docs/route-calls-contract.md (source of truth: backend api-contract.md).

Feature: Edit a route call
  As the organizer of a scheduled route call
  I want to edit its details
  So that attendees see up-to-date information

  Background:
    Given I am logged in as the organizer of the route call
    And the route call is in status "SCHEDULED"

  Scenario: The edit action is visible only to the organizer on a scheduled call
    When I open the event detail page
    Then I see the "Editar" action

  Scenario: The edit action is hidden once the call is ongoing
    Given the route call is in status "ONGOING"
    When I open the event detail page
    Then I do not see the "Editar" action

  Scenario: A non-organizer never sees the edit action
    Given I am logged in as a user who is not the organizer
    When I open the event detail page
    Then I do not see the "Editar" action

  Scenario: The edit form is pre-filled from the current values
    When I open the edit form
    Then the title, description, date, time and paces show the current values

  Scenario: Editing only changed fields sends a partial update
    When I change only the title to "Ruta nocturna por el centro"
    And I submit the form
    Then only the changed fields are sent to PATCH /api/route-calls/:id
    And I see the updated route call
    And the detail and list queries are refreshed

  Scenario: The date must be in the future
    When I set the date to a past date and time
    Then the form shows the error "La fecha y hora deben ser futuras"
    And nothing is sent to the backend

  Scenario: Clearing the description sends null
    When I empty the description field
    And I submit the form
    Then the payload sends description as null

  Scenario: A backend validation error is surfaced on the right field
    When I submit a title shorter than 3 characters
    And the backend replies 400 with an errors map for "title"
    Then the title field shows the backend message

  Scenario: Meeting points are not editable yet
    When I open the edit form
    Then no meeting-point editing controls are shown

Feature: Cancel a route call
  As the organizer of a route call
  I want to cancel it with a confirmation
  So that I do not cancel it by accident

  Scenario: The cancel action is available while scheduled
    Given I am logged in as the organizer
    And the route call is in status "SCHEDULED"
    When I open the event detail page
    Then I see the "Cancelar" action

  Scenario: The cancel action is available while ongoing
    Given I am logged in as the organizer
    And the route call is in status "ONGOING"
    When I open the event detail page
    Then I see the "Cancelar" action

  Scenario: Cancelling requires explicit confirmation
    Given I am the organizer of a scheduled route call
    When I click "Cancelar"
    Then a confirmation dialog opens
    And nothing is sent until I confirm

  Scenario: Confirming the cancellation calls the backend and refreshes the view
    Given the confirmation dialog is open
    When I confirm
    Then PATCH /api/route-calls/:id/cancel is called with an empty body
    And the route call status becomes "CANCELLED"
    And the detail and list queries are refreshed

  Scenario: Dismissing the dialog cancels nothing
    Given the confirmation dialog is open
    When I press Escape
    Then the dialog closes
    And no request is sent
    And focus returns to the "Cancelar" trigger

  Scenario: Cancelling an already completed call is not offered
    Given the route call is in status "COMPLETED"
    When I open the event detail page
    Then I do not see the "Cancelar" action

Feature: Delete a route call
  As an admin
  I want to delete a route call that has no attendees
  So that mistaken calls can be removed

  Scenario: Delete is visible to admins only
    Given I am logged in as an ADMIN
    When I open the event detail page
    Then I see the "Eliminar" action

  Scenario: A non-admin organizer does not see delete
    Given I am logged in as the organizer but not an admin
    When I open the event detail page
    Then I do not see the "Eliminar" action

  Scenario: Deleting requires confirmation and warns it is irreversible
    Given I am an admin on the event detail page
    When I click "Eliminar"
    Then a confirmation dialog warns that the action is irreversible
    And nothing is sent until I confirm

  Scenario: Confirming deletes and navigates away
    Given the delete confirmation dialog is open
    When I confirm
    Then DELETE /api/route-calls/:id is called
    And I am navigated away from the event detail page
    And the list query is refreshed

  Scenario: Deleting a call with attendees is blocked by the backend
    Given the route call has one or more attendances
    When I confirm the deletion
    And the backend replies 400
    Then I see the backend message advising to cancel instead
    And I remain on the event detail page