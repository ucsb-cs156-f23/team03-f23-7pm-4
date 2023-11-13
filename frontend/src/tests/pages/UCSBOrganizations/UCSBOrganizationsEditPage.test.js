import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBOrganizationsEditPage from "main/pages/UCSBOrganizations/UCSBOrganizationsEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            orgCode: "SKY"
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBOrganizationsEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsborganizations", { params: { orgCode: "SKY" } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit UCSBOrganization");
            expect(screen.queryByTestId("UCSBOrganizationForm-orgTranslation")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsborganizations", { params: { orgCode: "SKY" } }).reply(200, {
                orgCode: "SKY",
                orgTranslation: "Skydiving Club at UCSB",
                orgTranslationShort: "Skydiving Club",
                inactive: false
            });
            axiosMock.onPut('/api/ucsborganizations').reply(200, {
                orgCode: "SKY",
                orgTranslation: "changed translation",
                orgTranslationShort: "changed short translation",
                inactive: true
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBOrganizationForm-orgCode");

            const codeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
            const translationField = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
            const shortTranslationField = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
            const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
            const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

            expect(codeField).toHaveValue("SKY");
            expect(translationField).toHaveValue("Skydiving Club at UCSB");
            expect(shortTranslationField).toHaveValue("Skydiving Club");
            expect(inactiveField).not.toBeChecked();
            expect(submitButton).toBeInTheDocument();
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBOrganizationForm-orgCode");

            const codeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
            const translationField = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
            const shortTranslationField = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
            const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
            const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

            expect(codeField).toHaveValue("SKY");
            expect(translationField).toHaveValue("Skydiving Club at UCSB");
            expect(shortTranslationField).toHaveValue("Skydiving Club");
            expect(inactiveField).not.toBeChecked();
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(translationField, { target: { value: 'changed translation' } })
            fireEvent.change(shortTranslationField, { target: { value: 'changed short translation' } })
            fireEvent.click(inactiveField)

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("UCSBOrganization Updated - code: SKY translation: changed translation");
            expect(mockNavigate).toBeCalledWith({ "to": "/ucsborganizations" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ orgCode: "SKY" });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                orgTranslation: "changed translation",
                orgTranslationShort: "changed short translation",
                inactive: true
            })); // posted object

        });

    });
});
