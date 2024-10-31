import axios from "axios";
import { useState, useEffect } from "react";

function App() {

  //inisiasi state dan reducer kemudian mengambil data date dan rates dari api
  const [currencyData, setCurrencyData] = useState({
    date: '',
    rates: {}
  })

  //inisiasi array umtuk mengambil nilai rates tertentu
  const currencyList = ['CAD', 'IDR', 'JPY', 'CHF', 'EUR', 'GBP']

  //mengambil data dari api dengan axios saat komponen dimount
  useEffect(() => {
    axios.get('https://api.currencyfreaks.com/v2.0/rates/latest?apikey=d4000e9115b640d2ae0fef4ae5a9ebca')
    .then(respone => {
      setCurrencyData(respone.data)//menyimpan data ke state
    })
    .catch(error => {
      console.error('Error fetching data', error)
    })
  }, [])//Array kosong berarti effect hanya dijalankan sekali saat mount

  //menghitung rate buy and sell
  const calculateRates = (rate) => {
    const excangeRate = parseFloat(rate)//konversi string ke number
    return {
      buyRate: (excangeRate * 1.05).toFixed(6),// ditambah 5% -> 100+5 = 105 || 1.05
      sellRate: (excangeRate * 0.95).toFixed(6)// dikurang 5% -> 100-5 = 95 || 0.95
    }
  }

  //inisiasi state time untuk menyimpan waktu saat ini
  let [currentTime, setCurrentTime] = useState(new Date())

  //efek untuk membuat waktu berjalan tiap detik
  useEffect(() => {
    //membuat interval yg dijalankan tiap 1000ms || 1 detik
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000);

    //clear interval saat component mount || berjalan -> sehingga menghapus waktu terdahulu dan menyimpan waktu terbaru
    return () => clearInterval(interval)
  })

  return (
    <div className="container mx-auto px-20 py-40">
      <h2 className="text-3xl font-mono font-bold mb-4 text-center text-yellow-500">Exchange Information</h2>
      <h3 className="text-xl font-mono mb-4 text-center text-yellow-500">
        Date: {new Date(currencyData.date).toLocaleDateString()} {' '}
        Time: {currentTime.toLocaleTimeString()}
      </h3>
      <table className="table-auto border-collapse w-full font-mono">
        <caption className="caption-bottom mt-4 text-sm text-white">
          Rates are based from 1 USD.
          <br />
          This application uses API from https://currencyfreaks.com.
        </caption>
        <thead>
          <tr className="bg-yellow-100">
            <th className="border px-4 py-2">Currency</th>
            <th className="border px-4 py-2">We Buy</th>
            <th className="border px-4 py-2">Exchange Rate</th>
            <th className="border px-4 py-2">We Sell</th>
          </tr>
        </thead>
        <tbody>
          {/* Mapping array currencyList untuk membuat baris tabel */}
          { currencyList.map((currencyCode, index) => {

            //ambil rate untuk mata uang tertetu
            const rate = currencyData.rates[currencyCode]

            //hitung rate buy dan sell
            const { buyRate, sellRate } = calculateRates(rate)

            return(
              <tr key={currencyCode} className={index % 2 === 0 ? 'bg-white' : 'bg-yellow-100'}>
                <td className="border px-4 py-2">{currencyCode}</td>
                <td className="border px-4 py-2">{buyRate}</td>
                <td className="border px-4 py-2">{rate}</td>
                <td className="border px-4 py-2">{sellRate}</td>
              </tr>
            )
          })
          } 
        </tbody>
      </table>
    </div>
  );
}

export default App;