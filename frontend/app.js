/* global window document localStorage fetch alert */

// Fill in with your values
var AUTH0_CLIENT_ID = 'AUTH0_CLIENT_ID';
var AUTH0_DOMAIN = 'alpheios.auth0.com';
var AUTH0_CALLBACK_URL = window.location.href; // eslint-disable-line
var PRIVATE_ENDPOINT = 'https://w2tfh159s2.execute-api.us-east-2.amazonaws.com/prod/words';

// initialize auth0 lock
var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, { // eslint-disable-line no-undef

  auth: {
    params: {
      audience: 'alpheios.net:apis',
      scope: 'openid email',
    },
    responseType: 'token id_token',
  },
});

function updateUI() {
  var isLoggedIn = localStorage.getItem('id_token');
  if (isLoggedIn) {
    // swap buttons
    document.getElementById('btn-login').style.display = 'none';
    document.getElementById('btn-logout').style.display = 'inline';
    const profile = JSON.parse(localStorage.getItem('profile'));
    // show username
    document.getElementById('nick').textContent = profile.email;
  }
}

// Handle login
lock.on('authenticated', (authResult) => {
  console.log(authResult);
  lock.getUserInfo(authResult.accessToken, (error, profile) => {
    if (error) {
      // Handle error
      return;
    }

    document.getElementById('nick').textContent = profile.nickname;

    localStorage.setItem('accessToken', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('profile', JSON.stringify(profile));

    updateUI();
  });
});

updateUI();

// Handle login
document.getElementById('btn-login').addEventListener('click', () => {
  lock.show();
});

// Handle logout
document.getElementById('btn-logout').addEventListener('click', () => {
  localStorage.removeItem('id_token');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('profile');
  document.getElementById('btn-login').style.display = 'flex';
  document.getElementById('btn-logout').style.display = 'none';
  document.getElementById('nick').textContent = '';
});


// Handle private api call
document.getElementById('btn-private').addEventListener('click', () => {
  // Call private API with JWT in header
  const token = localStorage.getItem('accessToken');
  /*
   // block request from happening if no JWT token present
   if (!token) {
    document.getElementById('message').textContent = ''
    document.getElementById('message').textContent =
     'You must login to call this protected endpoint!'
    return false
  }*/
  // Do request to private endpoint
  fetch(PRIVATE_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(response => response.json())
    .then((data) => {
      console.log('Token:', data);
      document.getElementById('message').textContent = '';
      document.getElementById('message').textContent = data.message;
    })
    .catch((e) => {
      console.log('error', e);
    });
});
