// 지도(발견) 화면용 목업 데이터. 나중에 API로 교체하세요.

// 지도 크기 기준(px). 아래 x, y, w, h는 이 크기의 평면도에서 잰 값이고,
// 화면에서는 자동으로 비율에 맞춰 늘어나고 줄어듭니다.
export const MAP_SIZE = { w: 630, h: 530 };

// 지도 위 칸 배치 (왼쪽 위가 0,0). icon은 칸 안 아이콘 크기(px)예요.
export const MAP_CELLS = [
  { id: "wc-w",   type: "restroom",     x: 0,   y: 0,   w: 188, h: 117, icon: 80, label: "서쪽 화장실" },
  { id: "ext",    type: "extinguisher", x: 350, y: 0,   w: 70,  h: 100, icon: 70, label: "소화전" },
  { id: "exit",   type: "exit",         x: 422, y: 0,   w: 90,  h: 75,  icon: 64, label: "비상구" },
  { id: "stairs", type: "stairs",       x: 513, y: 0,   w: 117, h: 120, icon: 64, label: "동쪽 계단" },
  { id: "cafe-1", type: "cafe",         x: 0,   y: 120, w: 133, h: 74,  icon: 42, label: "카페", decor: true },
  { id: "shop-1", type: "shop",         x: 0,   y: 197, w: 133, h: 95,  icon: 56, label: "상점", decor: true },
  { id: "shop-2", type: "shop",         x: 0,   y: 294, w: 133, h: 83,  icon: 54, label: "상점", decor: true },
  { id: "cafe-2", type: "cafe",         x: 0,   y: 384, w: 133, h: 146, icon: 46, label: "카페", decor: true },
  { id: "elev-1", type: "elevator",     x: 513, y: 145, w: 117, h: 109, icon: 74, label: "동쪽 엘리베이터 1" },
  { id: "elev-2", type: "elevator",     x: 513, y: 299, w: 117, h: 108, icon: 74, label: "동쪽 엘리베이터 2" },
  { id: "wc-e",   type: "restroom",     x: 513, y: 412, w: 117, h: 118, icon: 84, label: "동쪽 화장실" },
];

// 가운데 둥근 테이블(장식, 빵 아이콘)
export const MAP_TABLES = [
  { x: 223, y: 214, w: 88, h: 58 },
  { x: 334, y: 214, w: 88, h: 58 },
  { x: 223, y: 293, w: 88, h: 58 },
  { x: 334, y: 293, w: 88, h: 58 },
];

export const DISCOVER_CATEGORIES = [
  { key: "restroom",     label: "화장실" },
  { key: "stairs",       label: "계단" },
  { key: "elevator",     label: "엘리베이터" },
  { key: "exit",         label: "비상구" },
  { key: "extinguisher", label: "소화전" },
];

// cell: 지도 위 칸 id (이 층에 없으면 null)
export const DISCOVER_ITEMS = {
  restroom: [
    { id: "r1", name: "B1 서쪽 화장실", distance: "0.5KM", where: "B1 상가 오른쪽", accessible: true, autoDoor: true, cell: "wc-w" },
    { id: "r2", name: "B1 동쪽 화장실", distance: "1KM",   where: "B1 상가 왼쪽",   accessible: true, autoDoor: true, cell: "wc-e" },
    { id: "r3", name: "사무실 화장실",  distance: "3KM",   where: "3층 사무실",     accessible: true, autoDoor: true, cell: null },
    { id: "r4", name: "옥상 화장실",    distance: "5KM",   where: "4층 옥상",       accessible: true, autoDoor: true, cell: null },
  ],
  stairs: [
    { id: "s1", name: "B1 동쪽 계단", distance: "0.5KM", where: "B1 상가 오른쪽", accessible: true, autoDoor: true, cell: "stairs" },
    { id: "s2", name: "1층 계단",     distance: "1KM",   where: "B1 상가 왼쪽",   accessible: true, autoDoor: true, cell: null },
    { id: "s3", name: "2층 계단",     distance: "3KM",   where: "2층 사무실",     accessible: true, autoDoor: true, cell: null },
    { id: "s4", name: "3층 계단",     distance: "5KM",   where: "4층 옥상",       accessible: true, autoDoor: true, cell: null },
  ],
  elevator: [
    { id: "e1", name: "B1 동쪽 엘리베이터 1", distance: "0.5KM", where: "B1 상가 오른쪽", accessible: true, autoDoor: true, cell: "elev-1" },
    { id: "e2", name: "B1 동쪽 엘리베이터 2", distance: "0.5KM", where: "B1 상가 오른쪽", accessible: true, autoDoor: true, cell: "elev-2" },
    { id: "e3", name: "1층 동쪽 엘리베이터 1", distance: "1KM",  where: "1층 오른쪽",     accessible: true, autoDoor: true, cell: null },
    { id: "e4", name: "1층 동쪽 엘리베이터 2", distance: "1KM",  where: "1층 오른쪽",     accessible: true, autoDoor: true, cell: null },
  ],
  exit: [
    { id: "x1", name: "B1 서쪽 비상구", distance: "0.5KM", where: "B1 상가 오른쪽", accessible: true, autoDoor: true, cell: "exit" },
    { id: "x2", name: "B1 동쪽 비상구", distance: "1KM",   where: "B1 상가 왼쪽",   accessible: true, autoDoor: true, cell: null },
    { id: "x3", name: "사무실 비상구",  distance: "3KM",   where: "3층 사무실",     accessible: true, autoDoor: true, cell: null },
    { id: "x4", name: "옥상 비상구",    distance: "5KM",   where: "4층 옥상",       accessible: true, autoDoor: true, cell: null },
  ],
  extinguisher: [
    { id: "f1", name: "B1 서쪽 소화전", distance: "0.5KM", where: "B1 상가 오른쪽", accessible: true, autoDoor: true, cell: "ext" },
    { id: "f2", name: "B1 동쪽 소화전", distance: "1KM",   where: "B1 상가 왼쪽",   accessible: true, autoDoor: true, cell: null },
    { id: "f3", name: "사무실 소화전",  distance: "3KM",   where: "3층 사무실",     accessible: true, autoDoor: true, cell: null },
    { id: "f4", name: "옥상 소화전",    distance: "5KM",   where: "4층 옥상",       accessible: true, autoDoor: true, cell: null },
  ],
};