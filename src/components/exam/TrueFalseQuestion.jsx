import { useTranslation } from "react-i18next";
import Button from "../form-controls/Button/Button";


export default function TrueFalseQuestion({ handleOptionChange, selectedOption }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 pb-3">
      <label className="block text-sm font-medium text-gray-700">{t('Choose the correct answer')}</label>
      <div className="flex gap-4 ">
        <input
          type="radio"
          id="true"
          name="trueFalse"
          value="True"
          checked={selectedOption === "True"}
          onChange={handleOptionChange}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600"
        />
        <label htmlFor="true">{t('True')}</label>

        <input
          type="radio"
          id="false"
          name="trueFalse"
          value="False"
          checked={selectedOption === "False"}
          onChange={handleOptionChange}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600"
        />
        <label htmlFor="false">{t('False')}</label>
      </div>
      <Button type="submit"  className={ "bg-blue-800 mb-2" }>
        {t('Submit')}
      </Button>
    </div>
  );
}
