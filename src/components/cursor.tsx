export function Cursor({ thin }: { thin?: boolean }) {
  return <span className={`t2-cursor${thin ? ' thin' : ''}`} />
}
