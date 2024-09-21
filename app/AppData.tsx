import  * as React from 'react';

interface AppDataType {
    screenData: {
        Onboarding1: {
            fName?: string,
            lName?: string,
        },
        Onboarding2: {
            email?: string,
            phoneNumber?: string,
        },
        Onboarding3?: {
            imageUri: string | null
        }
    };
    updateScreenData: (screenKey: any, newData: object) => void
}

const defaultValues: AppDataType = {
    screenData: {
        Onboarding1: {},
        Onboarding2: {},
        Onboarding3: {
            imageUri: "" || null
        }
    },
    updateScreenData: () => {}

}

const AppData = React.createContext<AppDataType>(defaultValues);

export const AppDataProvider = ({children}: any) => {
    
    const [screenData, setScreenData] = React.useState({
        Onboarding1: {
            fName: "",
            lName: ""
        },
        Onboarding2: {
            email: "",
            phoneNumber: ""
        },
        Onboarding3: {
            imageUri: "" || null
        }
    });

    let updateScreenData = (screenKey: any, newData: any) => {
    setScreenData((prev: any) => ({
        ...prev,
        [screenKey]: { ...prev[screenKey], ...newData }
    }));
};


    return(
        <AppData.Provider value={{screenData, updateScreenData}}>
            {children}
        </AppData.Provider>
    );
}

export const useAppData = () =>React.useContext(AppData);