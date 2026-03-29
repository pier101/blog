import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl border-b border-border py-16 text-center">
      <p className="text-sm text-muted-foreground">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground-strong">
        찾을 수 없는 페이지입니다
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-body-sm leading-8 text-muted-foreground">
        요청한 글이 아직 발행되지 않았거나 주소가 바뀌었습니다. 아카이브에서
        다시 찾아볼 수 있습니다.
      </p>
      <div className="mt-8 flex justify-center">
        <Link
          href="/"
          className="border-b border-foreground-strong pb-1 text-sm font-medium text-foreground-strong"
        >
          글 목록으로 이동
        </Link>
      </div>
    </div>
  );
}
