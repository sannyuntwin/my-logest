type KpiCardProps = {
  title: string;
  value: string | number;
};

function KpiCard({
  title,
  value,
}: KpiCardProps) {
  return (
    <div className="card">
      <p>{title}</p>

      <h2>{value}</h2>
    </div>
  );
}

export default KpiCard;