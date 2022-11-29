const API_Comments = "http://tt-api-server.azurewebsites.net/comments";
let hashtag_search = "ttpenadebernal";
searchHashtag(hashtag_search);

async function searchHashtag(hashtag) {
  const response = await fetch(API_Comments);
  const data = await response.json();
  console.log("HASHTAGS");
  const label = document.getElementById("label_place_hashtag");
  label.innerHTML = "#" + hashtag;
  data.tweets.forEach((tweet) => {
    if (tweet.hashtag == hashtag) {
      console.log("Hashtag encontrado:" + tweet.hashtag);
      const put_hashtag = document.getElementById("insert-tweets");
      put_hashtag.innerHTML += `
                    <blockquote class="twitter-tweet">
                        <p lang="es" dir="ltr">
                        <a href="https://twitter.com/${tweet.user}/status/${tweet.id}?ref_src=twsrc%5Etfw"></a>
                    </blockquote>             
                    `;
      return tweet.hashtag;
    }
  });
}
