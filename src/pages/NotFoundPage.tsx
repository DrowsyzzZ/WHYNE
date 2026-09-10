import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../components/ui/AsyncState';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="container-whyne grid min-h-[calc(100vh-64px)] place-items-center py-16 text-center">
      <div>
        <p className="mb-3 text-6xl font-bold text-primary">404</p>
        <EmptyState
          action={<Button onClick={() => void navigate('/')}>홈으로 돌아가기</Button>}
          description="주소가 잘못되었거나 페이지가 이동되었어요. 입력한 주소를 다시 확인해주세요."
          title="페이지를 찾을 수 없어요"
        />
      </div>
    </main>
  );
}
