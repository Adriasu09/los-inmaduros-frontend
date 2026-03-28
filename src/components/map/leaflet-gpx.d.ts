import * as L from "leaflet";

declare module "leaflet" {
  interface GPXOptions extends FeatureGroupOptions {
    async?: boolean;
    max_point_interval?: number;
    marker_options?: {
      startIconUrl?: string | null;
      endIconUrl?: string | null;
      shadowUrl?: string | null;
      wptIconUrls?: Record<string, string>;
    };
    polyline_options?: PolylineOptions;
    gpx?: string;
  }

  class GPX extends FeatureGroup {
    constructor(gpxData: string, options?: GPXOptions);
    get_distance(): number;
    get_elevation_gain(): number;
    get_elevation_loss(): number;
    get_start_time(): Date;
    get_end_time(): Date;
    get_moving_time(): number;
    get_total_time(): number;
    get_moving_pace(): number;
    get_moving_speed(): number;
    get_name(): string;
    getBounds(): LatLngBounds;
    reload(): void;
  }
}
