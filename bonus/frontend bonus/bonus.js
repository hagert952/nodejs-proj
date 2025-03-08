const downloadExcel = async () => {
    const companyId = '123456'; 
    const date = '2025-03-05'; 
  
    const response = await fetch(`http://localhost:3001/export-applications?companyId=${companyId}&date=${date}`);
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `applications_${companyId}_${date}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert('No applications found or error occurred');
    }
  };
  