import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { WineCard } from './cards/WineCard';

describe('design system components', () => {
  it('prevents duplicate submissions while a button is loading', () => {
    render(<Button isLoading>등록하기</Button>);
    expect(screen.getByRole('button', { name: '처리 중' })).toBeDisabled();
  });

  it('closes a modal with Escape', () => {
    function ModalFixture() {
      const [isOpen, setIsOpen] = useState(true);
      return (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="테스트 모달">
          내용
        </Modal>
      );
    }

    render(<ModalFixture />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not open a wine card when its like button is selected', () => {
    const onOpen = vi.fn();
    const onToggleLike = vi.fn();
    render(
      <WineCard
        onOpen={onOpen}
        onToggleLike={onToggleLike}
        wine={{
          id: 'wine-1',
          name: 'Sentinel Cabernet Sauvignon 2016',
          region: 'Western Cape, South Africa',
          price: 64990,
          imageUrl: '/wine.png',
          averageRating: 4.8,
          reviewCount: 47,
        }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /좋아요$/ }));
    expect(onToggleLike).toHaveBeenCalledWith('wine-1');
    expect(onOpen).not.toHaveBeenCalled();
  });
});
