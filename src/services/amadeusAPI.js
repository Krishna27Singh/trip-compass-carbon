
// Amadeus API Service
const amadeusAPI = {
  // API credentials
  apiKey: 'NaPzZ7boqIGqZefBmEHmiGsdFta8HHCN',
  apiSecret: 'qjCWakubmdMEJlKG',
  accessToken: null,
  tokenExpiry: null,
  
  // Get access token
  getAccessToken: async function() {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry > Date.now()) {
      return this.accessToken;
    }
    
    try {
      const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=client_credentials&client_id=${this.apiKey}&client_secret=${this.apiSecret}`
      });
      
      const data = await response.json();
      
      if (data.access_token) {
        this.accessToken = data.access_token;
        // Set expiry (convert seconds to milliseconds and subtract a buffer)
        this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000;
        return this.accessToken;
      } else {
        throw new Error('Failed to obtain access token');
      }
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  },
  
  // Get activities by location
  getActivitiesByLocation: async function(latitude, longitude, radius = 5) {
    try {
      // Get access token first
      const token = await this.getAccessToken();
      
      const response = await fetch(
        `https://test.api.amadeus.com/v1/shopping/activities?latitude=${latitude}&longitude=${longitude}&radius=${radius}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      const data = await response.json();
      
      if (data.errors) {
        console.error('API Error:', data.errors);
        return [];
      }
      
      return data.data || [];
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  }
};

export default amadeusAPI;
