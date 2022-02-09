import React from "react";

export function useLeads() {
  const [leadDetails, setLeadDetails] = React.useState("");

  return { leadDetails, setLeadDetails };
}
