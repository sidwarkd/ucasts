$(document).ready(function(){
  $(".episode-thumbnail").click(function(){
    window.location = $(this).attr("ref");
  });
});