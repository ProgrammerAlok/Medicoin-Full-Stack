import Card from "../components/Card";

export default function History() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold py-3">History Page</h1>
      
      <div style={{ height: "calc(100vh - 3rem)" }} className="bg-gray-800 text-white p-3 overflow-y-auto w-full">        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-2">

        {JSON.parse(localStorage.getItem("data"))?.map((item, index) => (
          <Card key={index} data={item} />
        ))}
        </div>
      </div>
    </div>
  );
}