import { Link } from 'react-router-dom';
import wine1 from '../assets/wines/wine-1.png';
import wine2 from '../assets/wines/wine-2.png';
import wine3 from '../assets/wines/wine-3.png';
import wine4 from '../assets/wines/wine-4.png';
import { Header } from '../components/layout/Header';

export function LandingPage() {
  return (
    <>
      <Header />
      <main className="overflow-hidden bg-white text-black">
        <section className="relative min-h-[465px] overflow-hidden rounded-b-xl text-white tablet:min-h-[625px] desktop:min-h-[660px]">
          <div className="relative z-10 container-whyne pt-32 tablet:pt-40 desktop:pt-44">
            <h1 className="text-3xl leading-tight font-bold tracking-tight tablet:text-4xl desktop:text-[42px]">
              한 곳에서 관리하는
              <br />
              나만의 와인창고
            </h1>
          </div>
          <img
            aria-hidden="true"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            src={wine1}
          />
        </section>

        <section className="container-whyne pt-28 pb-28 tablet:pt-40">
          <div className="space-y-24 tablet:space-y-32 desktop:space-y-40">
            <section className="grid gap-10 desktop:grid-cols-[0.7fr_1.3fr] desktop:items-center">
              <div>
                <h2 className="text-2xl leading-tight font-bold tablet:text-3xl">
                  매달 새롭게 만나는
                  <br />
                  와인 추천 콘텐츠
                </h2>
                <p className="mt-4 text-sm text-gray-600 tablet:text-base">
                  매달 다양한 인기 와인을 만나보세요.
                </p>
              </div>
              <div className="overflow-hidden rounded-tl-[40px] rounded-br-[40px]">
                <img
                  alt="이번 달 추천 와인 목록"
                  className="h-full w-full object-contain"
                  src={wine2}
                />
              </div>
            </section>

            <section className="grid gap-10 desktop:grid-cols-[1.3fr_0.7fr] desktop:items-center">
              <div className="desktop:order-2">
                <h2 className="text-2xl leading-tight font-bold tablet:text-3xl">
                  다양한 필터로 찾는
                  <br />내 맞춤 와인
                </h2>
                <p className="mt-4 text-sm text-gray-600 tablet:text-base">
                  와인 타입, 가격, 평점으로
                  <br />
                  나에게 맞는 와인을 쉽게 검색해요.
                </p>
              </div>
              <img alt="와인 타입, 가격, 평점 필터 화면" className="w-full" src={wine3} />
            </section>

            <section className="grid gap-10 desktop:grid-cols-[0.7fr_1.3fr] desktop:items-center">
              <div>
                <h2 className="text-2xl leading-tight font-bold tablet:text-3xl">
                  직관적인
                  <br />
                  리뷰 시스템
                </h2>
                <p className="mt-4 text-sm text-gray-600 tablet:text-base">
                  더 구체화된 리뷰 시스템으로
                  <br />
                  쉽고 빠르게 와인 리뷰를 살펴보세요.
                </p>
              </div>
              <img alt="와인 상세 정보와 사용자 리뷰 화면" className="w-full" src={wine4} />
            </section>
          </div>
          <Link
            className="mx-auto mt-24 flex min-h-14 max-w-lg items-center justify-center rounded-md bg-primary px-8 font-semibold text-gray-100 transition-colors hover:bg-primary-hover tablet:mt-32"
            to="/wines"
          >
            와인 보러가기
          </Link>
        </section>
      </main>
    </>
  );
}
