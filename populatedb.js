require("dotenv").config();

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = process.env.MONGO_URI;

main().catch((err) => console.log(err));
const Listing = require("./models/listing"); // Update the path accordingly
async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createListings();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}
async function listingCreate(index, title, content, category, urgency, user) {
  const listing = new Listing({
    title: title,
    content: content,
    category: category,
    urgency: urgency,
    user: user, // Include the user field
    likes: 0, // Initial value for likes
    views: 0, // Initial value for views
    createdAt: Date.now(),
  });

  await listing.save();
  console.log(`Added listing: ${title}`);
}

async function createListings() {
  console.log("Adding Listings");
  const userId = "65ab8ece801ccc839c0166a1"; // Use the provided user ID

  await Promise.all([
    listingCreate(
      0,
      "تجربة الأصالة: المأكولات البحرينية",
      "اكتشف طعم الأطعمة البحرينية الأصيلة في مطعمنا المحلي. لا تفوت الفرصة!",
      "65acc444a94b559b1e79c445",
      3,
      userId
    ),
    listingCreate(
      1,
      "Authentic Bahraini Products",
      "Discover and buy authentic Bahraini products at our local souq. Handcrafted treasures await!",
      "65acc452a94b559b1e79c447",
      2,
      userId
    ),
    listingCreate(
      2,
      "تصفح مجموعتنا المتنوعة",
      "استمتع بتجربة فريدة للتسوق في سوقنا. تصفح مجموعتنا المتنوعة واحصل على عروض رائعة!",
      "65acc452a94b559b1e79c447",
      1,
      userId
    ),
    listingCreate(
      3,
      "Special Offers This Weekend",
      "Visit our souq this weekend for special offers on a variety of products. Don't miss out!",
      "65acc452a94b559b1e79c447",
      2,
      userId
    ),
    listingCreate(
      4,
      "استمتع بتجربة التسوق الآمنة",
      "نحن نهتم بسلامتك! استمتع بتجربة تسوق آمنة في سوقنا مع إجراءات الوقاية اللازمة.",
      "65acc452a94b559b1e79c447",
      1,
      userId
    ),
    listingCreate(
      5,
      "Explore Handmade Crafts",
      "Explore a variety of handmade crafts from local artisans. Support local talent!",
      "65acc444a94b559b1e79c445",
      3,
      userId
    ),
  ]);
}
