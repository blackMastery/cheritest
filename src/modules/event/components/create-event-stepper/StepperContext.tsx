import React, { createContext, useReducer } from 'react'

const stepperSections = [
    {
        name: 'Create Event',
        is_complete: false,
        is_valid: false,
        hidden: false
    },
    {
        name: 'Add Schedule Poll',
        is_complete: false,
        is_valid: false,
        hidden: true
    },
    {
        name: 'Add Experiences',
        is_complete: false,
        is_valid: false,
        hidden: false
    },
    {
        name: 'Add Guests',
        is_complete: false,
        is_valid: false,
        hidden: false
    },
    {
        name: 'Confirm',
        is_complete: false,
        is_valid: false,
        hidden: false
    },
];

type StepperContextProps = {
    activeStep: number,
    steps: Array<any>,
    eventData: any,
    handleNext: () => void
    handleBack: () => void,
    isStepValid: () => boolean,
    isStepHidden: () => boolean,
    isStepComplete: () => boolean,
    setCurrentStepValidity: (value: boolean) => void,
    onSectionComplete: () => void,
    onEventSubmitCallback: (data: any) => void,
    goToStep: (step: number) => void,
    initStepper: () => void
}


export const StepperContext = createContext<StepperContextProps>({
    activeStep: 0,
    eventData: {},
    steps: stepperSections,
    handleNext() { },
    handleBack() { },
    isStepValid() { return false },
    isStepHidden() { return false },
    isStepComplete() { return false },
    setCurrentStepValidity(_value: boolean) { },
    onSectionComplete() { },
    onEventSubmitCallback(_data: any) { },
    goToStep(_step: number) { },
    initStepper() { }
})


interface ProviderProps {
    children: React.ReactNode
}


type Step = {
    name: string,
    is_complete: boolean,
    is_valid: boolean,
    hidden: boolean
}

type State = {
    activeStep: number
    eventData: any,
    steps: Array<Step>
}


type Action =
    | { type: 'nextStep' }
    | { type: 'previousStep' }
    | { type: 'skipNext' }
    | { type: 'setValid', value: boolean }
    | { type: 'setComplete' }
    | { type: 'setEvent', data: any }
    | { type: 'setCurrentStep', step: number }
    | { type: 'setHidden', step: number, hidden: boolean }
    | { type: 'initState' }


function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'initState':
            console.log('resetting data');
            const resetState: State = {
                activeStep: 0,
                eventData: {},
                steps: stepperSections
            };
            console.log(resetState);
            return resetState;

        case 'nextStep':
            // If this is not the last step
            if (state.activeStep !== state.steps.length - 2
                && state.activeStep !== state.steps.length - 1
                && state.activeStep !== state.steps.length
            ) {
                // Increment the active step by 2 instead of 1 to skip the next step
                if (state.steps[state.activeStep + 1].hidden === true) {
                    return {
                        ...state,
                        activeStep: state.activeStep + 2
                    }
                }
            }

            return {
                ...state,
                activeStep: state.activeStep + 1
            }

        case 'previousStep':
            // If this is not the first step
            if (state.activeStep !== 0) {
                // Decrement the activeStep by 2 to skip the previous one
                if (state.steps[state.activeStep - 1].hidden === true) {
                    return {
                        ...state,
                        activeStep: state.activeStep - 2
                    }
                }
            }

            return {
                ...state,
                activeStep: state.activeStep - 1
            }
        case 'skipNext':
            return {
                ...state,
                activeStep: state.activeStep + 2
            }
        case 'setValid':
            let newSteps = state.steps;
            newSteps[state.activeStep].is_valid = action.value;

            return {
                ...state,
                steps: newSteps
            }

        case 'setCurrentStep':
            return {
                ...state,
                activeStep: action.step
            }
        case 'setComplete':
            let completedSteps = state.steps;
            completedSteps[state.activeStep].is_complete = true;
            return {
                ...state,
                steps: completedSteps
            }

        case 'setEvent':
            return {
                ...state,
                eventData: action.data
            }
        case 'setHidden':
            let shownSteps = state.steps;
            shownSteps[action.step].hidden = false;
            return {
                ...state,
                steps: shownSteps
            }


        default:
            return state
    }
}


export function StepperProvider({ children }: ProviderProps) {
    const [{ activeStep, steps, eventData }, dispatch] = useReducer(reducer, {
        activeStep: 0,
        eventData: {},
        steps: stepperSections
    });

    // Proceed to next step
    const handleNext = () => dispatch({ type: 'nextStep' })

    // Go back to prev step
    const handleBack = () => dispatch({ type: 'previousStep' })

    const isStepValid = () => { return steps[activeStep].is_valid }
    const isStepHidden = () => { return steps[activeStep].hidden }

    const isStepComplete = () => { return steps[activeStep].is_complete }

    const setCurrentStepValidity = (value: boolean) => dispatch({ type: 'setValid', value: value })

    const onSectionComplete = () => {
        // Set the current step as complete
        dispatch({ type: 'setComplete' });
        // Go to the next step 
        dispatch({ type: 'nextStep' });
    }

    const onEventSubmitCallback = (_data: any) => {
        dispatch({ type: 'setEvent', data: _data })
        if (_data['has_poll'] === true) {
            console.log('has a poll')
            // Hide schedule poll step
            dispatch({ type: 'setHidden', step: 1, hidden: false })
        }
    }

    const goToStep = (step: number) => dispatch({ type: 'setCurrentStep', step: step })

    const initStepper = () => dispatch({ type: 'initState' });

    return (
        <StepperContext.Provider
            value={{
                activeStep,
                eventData,
                steps,
                handleNext,
                handleBack,
                isStepValid,
                isStepComplete,
                isStepHidden,
                setCurrentStepValidity,
                onSectionComplete,
                onEventSubmitCallback,
                goToStep,
                initStepper
            }}>
            <div>{children}</div>
        </StepperContext.Provider>
    )
}
