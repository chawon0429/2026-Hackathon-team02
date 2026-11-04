// 홈 화면용 목업 데이터. API가 붙으면 이 파일 대신 api/places.js 호출로 교체하면 됨
// facts 값: true = 있음(확인됨), false = 없음, null = 아직 정보 없음(제보 필요)

export const CATEGORIES = [
    { key: "access", label: "접근성", items: ["계단", "경사로", "자동문", "엘리베이터", "휠체어 이동가능"] },
    { key: "facility", label: "시설", items: ["화장실", "휠체어 화장실", "테이블 간격 넓음", "등받이 의자"] },
    { key: "menu", label: "메뉴·상품", items: ["메뉴판 있음", "큰 글씨 메뉴", "가격 표시", "사진 메뉴"] },
    { key: "benefit", label: "결제 혜택", items: ["카드 할인", "통신사 할인", "적립", "중복 적용"] },
    { key: "order", label: "주문·이용", items: ["키오스크", "선결제", "직원 호출", "셀프 반납"] },
];

export const MOCK_PLACES = [
    {
    id: 1,
    name: "하루카페",
    tags: "카페, 디저트",
    reviewCount: "999+",
    thumb: null,
    facts: {
        access: { "계단": false, "경사로": true, "자동문": true, "엘리베이터": true, "휠체어 이동가능": true },
        facility: { "화장실": true, "휠체어 화장실": null, "테이블 간격 넓음": true, "등받이 의자": true },
        menu: { "메뉴판 있음": true, "큰 글씨 메뉴": false, "가격 표시": true, "사진 메뉴": true },
        benefit: { "카드 할인": true, "통신사 할인": null, "적립": true, "중복 적용": false },
        order: { "키오스크": true, "선결제": true, "직원 호출": true, "셀프 반납": false },
    },
    },
    {
    id: 2,
    name: "eyyo 카페",
    tags: "카페, 디저트",
    reviewCount: "320",
    thumb: null,
    facts: {
        access: { "계단": true, "경사로": false, "자동문": false, "엘리베이터": null, "휠체어 이동가능": false },
        facility: { "화장실": true, "휠체어 화장실": false, "테이블 간격 넓음": false, "등받이 의자": true },
        menu: { "메뉴판 있음": true, "큰 글씨 메뉴": null, "가격 표시": true, "사진 메뉴": false },
        benefit: { "카드 할인": false, "통신사 할인": true, "적립": null, "중복 적용": null },
        order: { "키오스크": false, "선결제": false, "직원 호출": true, "셀프 반납": true },
    },
    },
    {
    id: 3,
    name: "하루식당",
    tags: "한식, 점심",
    reviewCount: "128",
    thumb: null,
    facts: {
        access: { "계단": false, "경사로": true, "자동문": true, "엘리베이터": null, "휠체어 이동가능": true },
        facility: { "화장실": true, "휠체어 화장실": true, "테이블 간격 넓음": null, "등받이 의자": false },
        menu: { "메뉴판 있음": true, "큰 글씨 메뉴": true, "가격 표시": true, "사진 메뉴": true },
        benefit: { "카드 할인": true, "통신사 할인": true, "적립": false, "중복 적용": null },
        order: { "키오스크": true, "선결제": false, "직원 호출": true, "셀프 반납": true },
    },
    },
];

export const MOCK_REVIEWS = [
    {
        reviewId: 1,
        id: 1,
        nickname: "테스트 사용자1",
        date: "2026.11.04",
        content: "1",
        likes: 3
    },
    {
        reviewId: 2,
        id: 1,
        nickname: "테스트 사용자2",
        date: "2026.11.03",
        content: "2",
        likes: 5
    },
    {
        reviewId: 3,
        id: 2,
        nickname: "테스트 사용자3",
        date: "2026.11.02",
        content: "3",
        likes: 2
    },
    {
        reviewId: 4,
        id: 3,
        nickname: "테스트 사용자4",
        date: "2026.11.01",
        content: "4",
        likes: 4
    },
    {
        reviewId: 5,
        id: 1,
        nickname: "테스트 사용자5",
        date: "2026.11.01",
        content: "5",
        likes: 4
    }
];