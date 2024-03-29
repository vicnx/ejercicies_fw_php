$('document').ready(function() {
  var userProfile;
  var content = $('.content');
  var loadingSpinner = $('#loading');
  content.css('display', 'block');
  loadingSpinner.css('display', 'none');

  var webAuth = new auth0.WebAuth({
    domain: credentials.aut0_domain,
    clientID: credentials.aut0_clientid,
    redirectUri: 'http://localhost/vicezon_fw_php/Ejercicios/3_test_social_login/signin_Auth0/',
    audience: 'https://' + credentials.aut0_domain + '/userinfo',
    responseType: 'token id_token',
    scope: 'openid profile',
    leeway: 60
  });

  var loginStatus = $('.container h4');
  var loginView = $('#login-view');
  var homeView = $('#home-view');
  var profileView = $('#profile-view');

  // buttons and event listeners
  var loginBtn = $('#btn-login');
  var logoutBtn = $('#btn-logout');
  var homeViewBtn = $('#btn-home-view');
  var profileViewBtn = $('#btn-profile-view');

  homeViewBtn.click(function() {
    homeView.css('display', 'inline-block');
    profileView.css('display', 'none');
  });

  profileViewBtn.click(function() {
    homeView.css('display', 'none');
    profileView.css('display', 'inline-block');
    getProfile();
  });

  loginBtn.click(function(e) {
    e.preventDefault();
    webAuth.authorize();
  });

  logoutBtn.click(logout);

  function setSession(authResult) {
    // Set the time that the access token will expire at
    var expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  function logout() {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    document.location.href = 'https://vicnx.eu.auth0.com/v2/logout?returnTo=http%3A%2F%2Flocalhost/vicezon_fw_php/Ejercicios/3_test_social_login/signin_Auth0/';
    // loq ue hago es redireccionar al logout y despues volver a la web (para ello tienes que configurar el redirect en auth0 en TENANT SETTINGS)
    displayButtons();
  }

  function isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  function displayButtons() {
    var loginStatus = $('.container h4');
    if (isAuthenticated()) {
      loginBtn.css('display', 'none');
      logoutBtn.css('display', 'inline-block');
      profileViewBtn.css('display', 'inline-block');
      loginStatus.text(
        'You are logged in! You can now view your profile area.'
      );
    } else {
      homeView.css('display', 'inline-block');
      loginBtn.css('display', 'inline-block');
      logoutBtn.css('display', 'none');
      profileViewBtn.css('display', 'none');
      profileView.css('display', 'none');
      loginStatus.text('You are not logged in! Please log in to continue.');
    }
  }

  function getProfile() {
    if (!userProfile) {
      var accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        console.log('Access token must exist to fetch profile');
      }

      webAuth.client.userInfo(accessToken, function(err, profile) {
        console.log(profile);
        if (profile) {
          userProfile = profile;
          displayProfile();
        }
      });
    } else {
      displayProfile();
    }
  }

  function displayProfile() {
    // display the profile
    console.log(userProfile);
    $('#profile-view .nickname').text(userProfile.nickname);
    $('#profile-view .full-profile').text(JSON.stringify(userProfile, null, 2));
    $('#profile-view img').attr('src', userProfile.picture);
  }

  function handleAuthentication() {
    webAuth.parseHash(function(err, authResult) {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        setSession(authResult);
        loginBtn.css('display', 'none');
        homeView.css('display', 'inline-block');
      } else if (err) {
        homeView.css('display', 'inline-block');
        console.log(err);
        alert('Error: ' + err.error + '. Check the console for further details.');
      }
      displayButtons();
    });
  }

  handleAuthentication();
});
