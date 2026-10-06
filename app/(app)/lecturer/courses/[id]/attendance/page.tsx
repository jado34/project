import LecturerAttendanceClient from './client';

export function generateStaticParams() {
  return [{ id: 'crs_201' }, { id: 'crs_202' }, { id: 'crs_203' }];
}

export default function LecturerAttendancePage({ params }: { params: any }) {
  return <LecturerAttendanceClient params={params} />;
}
