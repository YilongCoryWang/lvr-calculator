import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import Input from "./component/Input";
import {
  MIN_PROPERTY_VALUE,
  MAX_PROPERTY_VALUE,
  MIN_LOAN,
  MAX_LOAN,
  INPUT_DELAY,
} from "./utils/constants.ts";

function App() {
  const [estPropValue, setEstPropValue] = useState<number>(0);
  const [estLoanValue, setEstLoanValue] = useState<number>(0);
  const [propValuePhy, setPropValuePhy] = useState<number>(0);
  const [cashOutAmt, setCashOutAmt] = useState<number>(0);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const [showEvidence, setShowEvidence] = useState<boolean>(false);
  const [lvr, setLvr] = useState<number | null>(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const debounced = useDebouncedCallback((field, v) => {
    const value = parseInt(v);
    switch (field) {
      case "estPropVal":
        setEstPropValue(value);
        break;
      case "estLoanVal":
        setEstLoanValue(value);
        break;
      case "propValPhysical":
        setPropValuePhy(value);
        onPropValChange(value);
        break;
      case "cashOutAmt":
        setCashOutAmt(value);
        break;

      default:
        break;
    }
  }, INPUT_DELAY);

  const onSubmit = async () => {
    if (lvr && lvr > 90) {
      const url = import.meta.env.VITE_LVR_URL;
      const payload = {
        estLoanValue,
        cashOutAmt,
        propertyValue: propValuePhy > 0 ? propValuePhy : estPropValue,
      };
      await axios.post(url, payload);
      return;
    }
  };

  const onPropValChange = (value: number) => {
    setShowEvidence((show) => {
      if (!value) {
        return false;
      }
      if (show === false && value > 0) {
        return true;
      }
      return show;
    });
  };

  useEffect(() => {
    const getLVR = async () => {
      try {
        if (
          estLoanValue >= MIN_LOAN &&
          estLoanValue <= MAX_LOAN &&
          ((estPropValue >= MIN_PROPERTY_VALUE &&
            estPropValue <= MAX_PROPERTY_VALUE) ||
            propValuePhy > 0)
        ) {
          const payload = {
            estLoanValue,
            cashOutAmt,
            propertyValue: propValuePhy > 0 ? propValuePhy : estPropValue,
          };
          const res = await axios.post(
            "http://localhost:9000/api/v1/lvr",
            payload
          );
          if (res.status === 200) {
            const {
              data: { lvr },
            } = res;

            setLvr(lvr);

            if (lvr && lvr > 90) {
              return setIsSubmitDisabled(false);
            }
            setIsSubmitDisabled(true);
          }
        } else if (false === isSubmitDisabled) {
          setIsSubmitDisabled(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getLVR();
  }, [cashOutAmt, estPropValue, estLoanValue, propValuePhy, isSubmitDisabled]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-rose-50">
      {/* <!-- Card Container --> */}
      <div className="relative flex flex-col m-6 space-y-10 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0 md:m-0">
        {/* <!-- Left Container --> */}
        <form
          className="p-6 md:p-20 space-y-3 min-width-xs bg-center md:bg-none"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* <!-- Top Content --> */}
          <h2 className="font-mono mb-5 text-4xl font-bold">LVR Calculator</h2>
          <p className="max-w-sm mb-6 font-sans font-light text-gray-600">
            Please fill in the form and calculate Loan to Value Ratio.
          </p>
          {lvr && (
            <p className="font-mono mb-5 text-3xl font-semibold">
              Your LVR is: {lvr}%
            </p>
          )}
          <Input
            key="estPropVal"
            id="estPropVal"
            type="number"
            options={register("estPropVal", {
              required: "This field is required",
              min: MIN_PROPERTY_VALUE,
              max: MAX_PROPERTY_VALUE,
            })}
            label={`Estimated Property Value (A$${MIN_PROPERTY_VALUE} to A$
              ${MAX_PROPERTY_VALUE}) (required)`}
            errors={errors}
            onChangeHandler={(e) => debounced("estPropVal", e.target.value)}
            placeholder="* Enter Estimated Property Value"
          />

          <Input
            key="estLoanVal"
            id="estLoanVal"
            type="number"
            options={register("estLoanVal", {
              required: "This field is required",
              min: {
                value: MIN_LOAN,
                message: `Must be greater than ${MIN_LOAN}`,
              },
              max: {
                value: MAX_LOAN,
                message: `Must be less than ${MAX_LOAN}`,
              },
            })}
            label={`Estimated Loan Value (A$${MIN_LOAN} to A$${MAX_LOAN}) (required)`}
            errors={errors}
            onChangeHandler={(e) => debounced("estLoanVal", e.target.value)}
            placeholder="* Enter Estimated Loan Value"
          />

          <Input
            key="cashOutAmt"
            id="cashOutAmt"
            type="number"
            options={register("cashOutAmt", {
              min: {
                value: 0,
                message: "Must be greater than 0",
              },
              max: {
                value: estPropValue * 0.5,
                message: `Must be less than half of property value`,
              },
            })}
            label="Cash Out Amount"
            errors={errors}
            onChangeHandler={(e) => debounced("cashOutAmt", e.target.value)}
            placeholder="* Enter Cash Out Amount"
          />

          <Input
            key="propValPhysical"
            id="propValPhysical"
            type="number"
            options={register("propValPhysical")}
            label="Property Valuation (Physical)"
            errors={errors}
            onChangeHandler={(e) =>
              debounced("propValPhysical", e.target.value)
            }
            placeholder="* Enter Property Valuation (Physical)"
          />

          {showEvidence && (
            <Input
              key="propValEvd"
              id="propValEvd"
              type="file"
              options={register("propValEvd")}
              label="Property Valuation Evidence (required)"
              errors={errors}
              onChangeHandler={(e) => debounced("propValEvd", e.target.value)}
              placeholder="Property Valuation Evidence"
            />
          )}

          <div className="flex flex-col items-center justify-between mt-6 space-y-6 md:flex-row md:space-y-0">
            <button
              disabled={isSubmitDisabled}
              className="w-full md:w-auto flex justify-center items-center p-4 space-x-4 font-sans font-bold text-white rounded-md shadow-lg px-9 bg-cyan-700 shadow-cyan-100 hover:bg-opacity-90 shadow-sm hover:shadow-lg border transition hover:-translate-y-0.5 duration-150 active:translate-y-0
                        disabled:bg-gray-500 disabled:text-gray-200"
            >
              <span>Submit</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#ffffff"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <line x1="5" y1="12" x2="19" y2="12" />
                <line x1="13" y1="18" x2="19" y2="12" />
                <line x1="13" y1="6" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </form>

        {/* <!-- Right Container --> */}
        <img src="/house.avif" alt="" className="w-[430px] hidden md:block" />
      </div>
    </div>
  );
}

export default App;
