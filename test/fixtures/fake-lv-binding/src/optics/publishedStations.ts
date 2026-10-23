// Synthetic station provenance: only stations marked published are returned.
export function publishedZoomStations(L) {
  const stations = L.source.zoom?.stations;
  return stations ? stations.flatMap((station, index) => station.published === false ? [] :
    [{ index, zoomT: index / (stations.length - 1) }]) : [{ index: 0, zoomT: 0 }];
}
