import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBOrganizationsCreatePage from "main/pages/UCSBOrganizations/UCSBOrganizationsCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBOrganizationsCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const ucsbOrganization = {
            orgCode: "SKY",
            orgTranslation: "Skydiving Club at UCSB",
            orgTranslationShort: "UCSB Skydiving",
            inactive: false
        };

        axiosMock.onPost("/api/ucsborganizations/post").reply( 202, ucsbOrganization );

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBOrganizationsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("UCSBOrganizationForm-orgTranslation")).toBeInTheDocument();
        });

        const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
        const orgTranslationField = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
        const orgTranslationShortField = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
        const orgInactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
        const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

        fireEvent.change(orgCodeField, { target: { value: 'SKY' } });
        fireEvent.change(orgTranslationField, { target: { value: 'Skydiving Club at UCSB' } });
        fireEvent.change(orgTranslationShortField, { target: { value: 'Skydiving Club' } });
        fireEvent.change(orgInactiveField, { target: { value: false } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "orgCode": "SKY",
            "orgTranslation": "Skydiving Club at UCSB",
            "orgTranslationShort": "Skydiving Club",
            "inactive": false
        });

        expect(mockToast).toBeCalledWith("New ucsbOrganization Created - code: SKY translation: Skydiving Club at UCSB");
        expect(mockNavigate).toBeCalledWith({ "to": "/ucsborganizations" });
    });


});


