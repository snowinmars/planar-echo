export const PSTEE_SEARCH_CELL_WIDTH = 16;
export const PSTEE_SEARCH_CELL_HEIGHT = 12;
export const PSTEE_TILE_PX = 64;

export const searchmapPropsize = (overlayWidth: number, overlayHeight: number): Readonly<{
  colsCount: number;
  rowsCount: number;
}> => ({
  colsCount: overlayWidth * Math.floor(PSTEE_TILE_PX / PSTEE_SEARCH_CELL_WIDTH),
  rowsCount: Math.floor((overlayHeight * PSTEE_TILE_PX) / PSTEE_SEARCH_CELL_HEIGHT),
});
