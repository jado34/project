import LecturerGradingClient from './client';

export function generateStaticParams() {
  return [{ id: 'crs_201' }, { id: 'crs_202' }, { id: 'crs_203' }];
}

export default function LecturerGradingPage({ params }: { params: any }) {
  return <LecturerGradingClient params={params} />;
}
