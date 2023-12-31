import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import UCSBOrganizationForm from "main/components/UCSBOrganizations/UCSBOrganizationForm";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("RestaurantForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Organization Code", "Organization Translation", "Short Translation", "Inactive"];
    const testId = "UCSBOrganizationForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm initialContents={ucsbOrganizationFixtures.oneOrg} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-orgCode`)).toBeInTheDocument();
        expect(screen.getByText(`Organization Code`)).toBeInTheDocument();
    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        expect(await screen.findByText(/Org code is required/)).toBeInTheDocument();
        expect(await screen.findByText(/Org translation is required/)).toBeInTheDocument();
        expect(await screen.findByText(/Short translation is required/)).toBeInTheDocument();

        const orgCodeInput = screen.getByTestId(`${testId}-orgCode`);
        fireEvent.change(orgCodeInput, { target: { value: "a".repeat(6) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Max length 5 characters/)).toBeInTheDocument();
        });

        const translationInput = screen.getByTestId(`${testId}-orgTranslation`);
        fireEvent.change(translationInput, { target: { value: "a".repeat(101) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Max length 100 characters/)).toBeInTheDocument();
        });

        const orgCodeInput2 = screen.getByTestId(`${testId}-orgCode`);
        fireEvent.change(orgCodeInput2, { target: { value: "a".repeat(4) } });
        fireEvent.click(submitButton);

        await waitFor(() => { 
            expect(screen.getByText(/Org code must be all uppercase/)).toBeInTheDocument();
        });
    });

    test("that no Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();

        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <UCSBOrganizationForm submitAction={mockSubmitAction} />
                </Router>
            </QueryClientProvider>
        );

        const orgCodeInput = screen.getByTestId(`${testId}-orgCode`);
        const translationInput = screen.getByTestId(`${testId}-orgTranslation`);
        const translationShortInput = screen.getByTestId(`${testId}-orgTranslationShort`);
        const inactiveInput = screen.getByTestId(`${testId}-inactive`);
        const submitButton = screen.getByTestId(`${testId}-submit`);

        fireEvent.change(orgCodeInput, { target: { value: 'NEW' } });
        fireEvent.change(translationInput, { target: { value: 'new Translation' } });
        fireEvent.change(translationShortInput, { target: { value: 'new Short Translation' } });
        fireEvent.change(inactiveInput, { target: { value: true } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Org code must be all uppercase/)).not.toBeInTheDocument();
    });
    
});
