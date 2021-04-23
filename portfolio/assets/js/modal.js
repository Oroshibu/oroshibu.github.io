// Get the modal
var modal = document.getElementById("myModal");

// Get the image and insert it inside the modal - use its "alt" text as a caption
var modalImg = document.getElementById("img01");
var anchors = document.getElementsByClassName('modalImgClass');
for(var i = 0; i < anchors.length; i++) {
  var anchor = anchors[i];
    anchor.onclick = function(){
      console.log("fungus");
      modal.style.display = "block";
      modalImg.src = this.src;
    }
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("closePic")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}
