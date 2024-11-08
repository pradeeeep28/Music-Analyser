const CLIENT_ID = 'a09b4a4a8f5d407c9e69e0a5dc76deb9'; // Replace with your Spotify client ID
const REDIRECT_URI = 'https://pradeeeep28.github.io/Music-Analyser/callback/'; // This should match the redirect URI you set in Spotify Developer Console
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user-library-read%20user-top-read%20playlist-read-private`;

// Login Button Handler
document.getElementById("spotify-login-btn").addEventListener("click", function() {
    window.location.href = AUTH_URL; // Redirect to Spotify login
});

// After the user logs in, Spotify will redirect with the code
window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
        // Exchange the code for an access token
        const TOKEN_URL = 'https://accounts.spotify.com/api/token';
        const body = new URLSearchParams();
        body.append('grant_type', 'authorization_code');
        body.append('code', code);
        body.append('redirect_uri', REDIRECT_URI);
        body.append('client_id', CLIENT_ID);
        body.append('client_secret', 'c7ce06740fc046a193f07b3b169290c4'); // Replace with your client secret

        fetch(TOKEN_URL, {
            method: 'POST',
            body: body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => response.json())
        .then(data => {
            const accessToken = data.access_token;
            // Now you have the access token, fetch user top artists
            fetchUserTopTracks(accessToken);
        });
    }
};

// Fetch the user's top tracks (or artists)
function fetchUserTopTracks(accessToken) {
    fetch('https://api.spotify.com/v1/me/top/artists?limit=5', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Top Artists:', data);
        analyzeUserMusic(data); // Analyze their music preferences
    });
}

// Analyze Music and Display Personality
function analyzeUserMusic(data) {
    const topArtists = data.items.map(artist => artist.name.toLowerCase());
    console.log("Top Artists: ", topArtists);
    
    // Example: Mock mapping top artists to MBTI types
    const genres = {
        "pop": "ENFP",
        "rock": "ISTJ",
        "classical": "INFJ",
        "jazz": "INFP",
        "hip-hop": "ENTP"
    };
    
    let personality = "ISFP"; // Default personality
    topArtists.forEach(artist => {
        if (artist.includes("pop")) personality = "ENFP";
        if (artist.includes("rock")) personality = "ISTJ";
        if (artist.includes("jazz")) personality = "INFP";
        if (artist.includes("classical")) personality = "INFJ";
        // Add more logic based on artists or genres
    });
    
    // Display the result
    document.getElementById("result").innerHTML = `Your MBTI personality type: <strong>${personality}</strong>`;
}
