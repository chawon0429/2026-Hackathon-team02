import { useState} from 'react'
import './SubmissionPage.css'
import BottomTabBar from "../components/BottomTabBar";

const categories = [
    {title: '접근성', options: ['계단', '경사로', '자동문', '엘리베이터', '휠체어 가능']},
    {title: '시설', options: ['유아의자', '장애인석', '콘센트', '흡연구역', '주차']},
    {title: '결제 혜택', options: ['카드 결제', '네이버 페이', '제로 페이', '포인트 적립', '통신사 할인']}
];

const questions = [
  { key: 'method', label: '어떻게 이용하셨나요?', options: ['매장에서 이용', '예약 후 이용', '포장·배달 이용'] },
  { key: 'wait', label: '대기 후 이용하셨나요?', options: ['바로 입장', '10분 이내', '30분 이상'] },
  { key: 'minimum', label: '최소 주문이 있나요?', options: ['최소 주문 없음', '1인 1메뉴', '2인분 이상'] }
];

function SubmissionPage() {
    const [selectedCategories, setSelectedCategories] = useState([])

    const toggleFeature = (option) => {
        setSelectedFeatures((prev) => prev.includes(option)? prev.filter((item) => item !== option): [...prev, option])
    }

     return (
        <div className="submission-app">
            <h1>리뷰 작성 페이지</h1>
            <p>React 화면이 정상적으로 실행되었습니다!</p>
        </div>
    )
}


export default SubmissionPage