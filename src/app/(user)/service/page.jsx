// "use client";
// import useAuth from "@/app/hooks/useAuth";
// import CardItem from "@/components/CardItem";
// import Footer from "@/components/Footer";
// import Navbar from "@/components/Navbar";
// import { db } from "@/firebase/firebase";
// import { collection, onSnapshot } from "firebase/firestore";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";

// const Service = () => {
//   const { user, userProfile } = useAuth();
//   const router = useRouter();
//   useEffect(() => {
//     if (user && userProfile.role === "admin") {
//       router.push("/admin");
//     }
//   }, [user, userProfile, router]);
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const unsub = onSnapshot(
//       collection(db, "services"),
//       (snapshot) => {
//         let list = [];
//         snapshot.docs.forEach((doc) => {
//           list.push({ id: doc.id, ...doc.data() });
//         });
//         setData(list);
//       },
//       (error) => {
//         console.log(error);
//       }
//     );
//     return () => {
//       unsub();
//     };
//   }, []);
//   return (
//     <div>
//       <Navbar />
//       <div className="relative mt-20 md:mt-14">
//         <Image
//           src={"/assets/BG4.jpg"}
//           width={1410 / 2}
//           height={675 / 2}
//           decoding="async"
//           priority
//           sizes="(max-width: 768px) 600px, 1410px"
//           alt="Service page"
//           className="relative w-full h-[600px] md:h-screen object-cover object-center mx-auto"
//         />
//         <div className="absolute top-1/3 md:top-[350px] left-1/2 -translate-x-1/2 text-center flex flex-col gap-3 bg-white shadow-xl p-6 rounded-xl border">
//           <h1 className="text-4xl font-extrabold text-gray-950">Services</h1>
//         </div>
//       </div>
//       <div className="p-8 md:p-24">
//         <div className="text-center mb-10">
//           <h2 className="text-3xl mb-3">Our Services</h2>
//           <p>Best service that we offer</p>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 place-items-center gap-6">
//           {data.map((service) => (
//             <CardItem
//               key={service.id}
//               imageUrl={service.image}
//               judul={service.title}
//               deskripsi={service.description}
//             />
//           ))}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Service;



//tgl 1 Desember 2024
// "use client";
// import React, { useEffect, useState } from "react";
// import useAuth from "@/app/hooks/useAuth";
// import { db } from "@/firebase/firebase";
// import { collection, onSnapshot } from "firebase/firestore";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import CardItem from "@/components/CardItem";
// import CalendarComponent from "@/components/CalendarComponent";
// import { useRouter } from "next/navigation"; // Import useRouter dari next/router

// const Service = () => {
//   const { user, userProfile } = useAuth();
//   const [events, setEvents] = useState([]);
//   const router = useRouter(); // Mendapatkan objek router dari useRouter

//   useEffect(() => {
//     const unsub = onSnapshot(
//       collection(db, "events"),
//       (snapshot) => {
//         let list = [];
//         snapshot.docs.forEach((doc) => {
//           list.push({ id: doc.id, ...doc.data() });
//         });
//         setEvents(list);
//       },
//       (error) => {
//         console.log(error);
//       }
//     );
//     return () => {
//       unsub();
//     };
//   }, []);

//   useEffect(() => {
//     if (user && userProfile.role === "admin") {
//       router.push("/admin");
//     }
//   }, [user, userProfile, router]);

//   return (
//     <div>
//       <Navbar />
//       <div className="relative mt-20 md:mt-14">
//         {/* Background Image */}
//       </div>
//       <div className="p-8 md:p-24">
//         <div className="text-center mb-10">
//           <h2 className="text-3xl mb-3">Tanggal Tahunan BE AGENCY</h2>
//           <p>Best service that we offer</p>
//         </div>
//         <CalendarComponent events={events} />
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Service;


"use client";
import React, { useState, useEffect } from "react";
import useAuth from "@/app/hooks/useAuth";
import { db } from "@/firebase/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CalendarComponent from "@/components/CalendarComponent";
import Modal from "@/components/Modal";

const Service = () => {
  const { user, userProfile } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedDateData, setSelectedDateData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all events from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "userPengajuanCuti"), (snapshot) => {
      let list = [];
      snapshot.docs.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setEvents(list);
    });

    return () => unsub();
  }, []);

  // Handle date click
  const handleDateClick = async (date) => {
    console.log("Tanggal yang diklik:", date);

    const q = query(
      collection(db, "userPengajuanCuti"),
      where("startDate", "<=", date),
      where("endDate", ">=", date)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      let details = [];
      snapshot.docs.forEach((doc) => {
        details.push({ id: doc.id, ...doc.data() });
      });

      console.log("Data yang ditemukan:", details);

      setSelectedDateData(details);
      setIsModalOpen(true);
    });

    return () => unsub();
  };

  return (
    <div>
      <Navbar />
      <div className="relative mt-20 md:mt-14">
        {/* Background */}
      </div>
      <div className="p-8 md:p-24">
        <div className="text-center mb-10">
          <h2 className="text-3xl mb-3">Tanggal Tahunan BE AGENCY</h2>
          <p>Best service that we offer</p>
        </div>
        <CalendarComponent events={events} onDateClick={handleDateClick} />
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedDateData.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Detail Data</h2>
            {selectedDateData.map((data) => (
              <div key={data.id} className="border p-4 rounded-lg mb-4">
                <p><strong>Email:</strong> {data.email}</p>
                <p><strong>Nama:</strong> {data.fullname}</p>
                <p><strong>Reason:</strong> {data.reason}</p>
                <p><strong>Status:</strong> {data.status}</p>
                <p><strong>Start Date:</strong> {data.startDate}</p>
                <p><strong>End Date:</strong> {data.endDate}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Tidak ada data untuk tanggal ini.</p>
        )}
      </Modal>
      <Footer />
    </div>
  );
};

export default Service;



