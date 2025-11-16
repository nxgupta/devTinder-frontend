import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useState } from "react";

const [isPremiumUser, setIsPremiumUser] = useState(false);

const verifyPremiumUser = async () => {
    const res = await axios.get(BASE_URL + "/premium/verify", { withCredentials: true });
    if (res.data.isPremium) setIsPremiumUser(true);
};

const PlanCard = ({ planName, benefits, buyPlan }) => {
    return (
        <div className="card bg-base-300 rounded-box grid h-auto place-items-center p-4">
            <h2 className="text-xl font-bold">{planName}</h2>
            <ul className="list-disc list-inside mt-2">
                {benefits.map((benefit, index) => (
                    <li key={index} className="text-sm">
                        {benefit}
                    </li>
                ))}
            </ul>
            <button onClick={() => buyPlan(planName)} className="btn btn-primary m-2">Buy {planName}</button>
        </div>
    );
};

const Premium = () => {
    const silverBenefits = ["Basic Support", "Access to limited features", "Monthly updates"];
    const goldBenefits = ["Priority Support", "Access to all features", "Weekly updates", "Exclusive content"];

    const buyPlan = async (membershipType) => {
        let res = await axios.post(BASE_URL + "/payment/create", {
            membershipType
        }, { withCredentials: true })

        let { key, amount, currency, orderId, notes } = res.data;
        console.log(res)
        // Open Razorpay Checkout
        const options = {
            key,
            amount,
            currency,
            name: 'Dev Tinder',
            description: 'Connect To Developers',
            order_id: orderId,
            prefill: {
                name: notes.firstName + " " + notes.lastName,
                email: notes.emailId
            },
            theme: {
                color: '#F37254'
            },
            handler: verifyPremiumUser
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

    }

    return isPremiumUser ? (<>You are already a Premium User</>) : (
        <div className="flex w-half flex-col">
            <PlanCard planName="Silver" benefits={silverBenefits} buyPlan={buyPlan} />
            <div className="divider"></div>
            <PlanCard planName="Gold" benefits={goldBenefits} buyPlan={buyPlan} />
        </div>
    );
};

export default Premium;