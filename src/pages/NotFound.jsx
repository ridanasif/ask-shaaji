import { Link } from "react-router-dom";
import { getMascotHead } from "../constants/app";
import { useLanguageStore } from "../store/languageStore";

const NotFound = () => {
  // Get both the language and the hydration status
  const { language } = useLanguageStore();

  const getNotFoundMessage = () => {
    switch (language) {
      case "ta":
        return "தம்பி, நீங்க தேடுறது இங்க இல்ல! சும்மா கம்ப்யூட்டர் முன்னாடி உட்கார்ந்தா எதுவும் கிடைக்காது. போய் வேலைய பாரு!";
      case "hi":
        return "बेटा, जो तुम ढूंढ रहे हो वो यहाँ नहीं है! कंप्यूटर के सामने बैठे रहने से कुछ नहीं मिलेगा। जाओ, कोई काम-धंधा करो!";
      case "mr":
        return "बाळा, तू जे शोधत आहेस ते इथे नाही! सारखं कॉम्प्युटरसमोर बसून काही होणार नाही. जा, काहीतरी काम कर!";
      case "ar":
        return "يا حبيبي، ما تبحث عنه ليس هنا! لن تجد شيئًا بالجلوس أمام الكمبيوتر طوال اليوم. اذهب وابحث عن عمل حقيقي!";
      case "kn":
        return "ಮಗನೆ, ನೀವು ಹುಡುಕುತ್ತಿರುವುದು ಇಲ್ಲಿಲ್ಲ! ಕಂಪ್ಯೂಟರ್ ಮುಂದೆ ಕುಳಿತರೆ ಏನೂ ಸಿಗುವುದಿಲ್ಲ. ಹೋಗಿ ಕೆಲಸ ಮಾಡು!";
      case "te":
        return "నాయనా, నువ్వు వెతుకుతున్నది ఇక్కడ లేదు! కంప్యూటర్ ముందు కూర్చుంటే ఏమీ దొరకదు. వెళ్ళి పని చేసుకో!";
      case "bn":
        return "বাবা, তুমি যা খুঁজছ তা এখানে নেই! শুধু কম্পিউটারের সামনে বসে থাকলে কিছু হবে না। যাও, কাজ কর!";
      default:
        return "മോനേ, നീയിവിടെ നോക്കിയത് കിട്ടില്ല! കമ്പ്യൂട്ടറിലിങ്ങനെ കുത്തിയിരുന്നാൽ പലതും മിസ്സാകും. വല്ല പണിക്കും പോയി ജീവിക്ക്, പോ!";
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center flex-col bg-gray-100 dark:bg-neutral-900 p-5 text-center">
      <h1 className="text-5xl font-bold text-gray-700 dark:text-neutral-400">
        404
      </h1>
      <p
        dir={language === "ar" ? "rtl" : "ltr"}
        className="mt-4 text-base md:text-lg text-gray-700 dark:text-neutral-400"
      >
        {getNotFoundMessage()}
      </p>
      <Link
        className="mt-6 text-sm font-medium text-blue-500 hover:underline cursor-pointer"
        to="/"
      >
        Return to main page
      </Link>
    </div>
  );
};

export default NotFound;
