<script>
function setCookie(cookiename, cookievalue, expdays) {
  var d = new Date();
  d.setTime(d.getTime()+(expdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cookiename + "=" + cookievalue + "; " + expires;
}
function getCookie(cookiename) {
  var name = cookiename + "=";
  var startPos = document.cookie.indexOf(name);
  if(startPos == -1) return null;
  startPos+=(name.length);
  if(document.cookie.indexOf(";",startPos) == -1){
    return document.cookie.substring(startPos,document.cookie.length);
  }
  else{
    return document.cookie.substring(startPos,document.cookie.indexOf(';',startPos));
  }
return null;
}
function checkCookie() {
   var loggedin = getCookie("loggedin");
   if (loggedin && loggedin !=null) {
     // Logged in
     //do  nothing
   }
   else{
     window.location.href="login.php";
   }
}
</script>
