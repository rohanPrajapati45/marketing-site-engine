function Empty({ section }) {
  const { height = "100vh" } = section.data;

  return <div style={{ height }} className="w-full" />;
}

export default Empty;
