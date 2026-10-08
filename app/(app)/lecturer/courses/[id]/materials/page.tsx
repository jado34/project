import LecturerMaterialsClient from './client';

export function generateStaticParams() {
  return [
    { id: 'crs_101' },
    { id: 'crs_103' },
    { id: 'crs_201' },
    { id: 'crs_203' },
    { id: 'crs_205' },
    { id: 'crs_301' },
    { id: 'crs_303' },
    { id: 'crs_401' },
    { id: 'crs_403' },
    { id: 'crs_405' },
  ];
}

export default function LecturerMaterialsPage({ params }: { params: any }) {
  return <LecturerMaterialsClient params={params} />;
}
