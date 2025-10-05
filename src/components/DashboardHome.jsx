import React from "react";
import TestCard from "./TestCard";

const DashboardHome = ({ tests }) => {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tests.map((test) => (
        <TestCard key={test.id} test={test} />
      ))}
    </div>
  );
};

export default DashboardHome;
