import React, { useState, useEffect, useRef } from "react";
import { db } from "./firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import Navbar from "./Navbar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./History.css";

const History = () => {
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const historyRef = useRef();

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const q = query(
          collection(db, "businessProposals"),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        const proposalsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProposals(proposalsData);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposals();
  }, []);

  const handleDownload = () => {
    const input = historyRef.current;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 190; // Width of the image
      const pageHeight = pdf.internal.pageSize.height; // Height of the page
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculate image height to maintain aspect ratio
      let heightLeft = imgHeight;

      let position = 0;

      // Add the image to the PDF and check if it fits on the page
      while (heightLeft >= 0) {
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        position -= pageHeight; // Move the position down
        if (heightLeft >= 0) {
          pdf.addPage(); // Add a new page if there's more content
        }
      }

      pdf.save("proposal-history.pdf");
    });
  };

  return (
    <div className="history" ref={historyRef}>
      <Navbar />
      <h2>Proposal History</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <button onClick={handleDownload} className="download-button">
            Download History as PDF
          </button>
          <ul className="proposal-list">
            {proposals.map((proposal) => (
              <li key={proposal.id} className="proposal-item">
                <h3>{proposal.industry} Industry Proposal</h3>
                <p>
                  <strong>Goals:</strong> {proposal.goals}
                </p>
                <p>
                  <strong>Challenges:</strong> {proposal.challenges}
                </p>
                <p>
                  <strong>Target Market:</strong> {proposal.targetMarket}
                </p>
                <details>
                  <summary>View Proposal</summary>
                  <pre>{proposal.proposal}</pre>
                </details>
                <p className="timestamp">
                  Created on: {proposal.timestamp.toDate().toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default History;
