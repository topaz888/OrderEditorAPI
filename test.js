async function cancelOrder(key) {
  const response = await fetch("https://lobster-app-6yz9w.ondigitalocean.app/cancelOrder", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ key: key })
  });

  if (!response.ok) {
    throw new Error('Network response was not ok ' + response.statusText);
  }

  const data = await response.json();
  return data;
}

// Usage
cancelOrder("6107666514081")
  .then(data => console.log(data))
  .catch(error => console.error('There was a problem with the fetch operation:', error));