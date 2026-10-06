import LecturerMaterialsClient from './client';

export function generateStaticParams() {
  return [{ id: 'crs_201' }, { id: 'crs_202' }, { id: 'crs_203' }];
}

export default function LecturerMaterialsPage({ params }: { params: any }) {
  return <LecturerMaterialsClient params={params} />;
}
