import { Link } from 'react-router-dom';
import { EmptyState } from '../components/ui/AsyncState';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return <main className="container-whyne py-16"><EmptyState action={<Button><Link to="/">홈으로 돌아가기</Link></Button>} description="주소가 잘못되었거나 페이지가 이동되었어요." title="페이지를 찾을 수 없어요" /></main>;
}
