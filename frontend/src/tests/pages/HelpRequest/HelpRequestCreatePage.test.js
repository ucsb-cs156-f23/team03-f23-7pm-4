import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestCreatePage from "main/pages/HelpRequest/HelpRequestCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
//import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
//import { HelpRequestForm } from "main/components/HelpRequest/HelpRequestForm";
//import HelpRequestEditPage from "main/pages/HelpRequest/HelpRequestEditPage";

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

describe("HelpRequestCreatePage tests", () => {

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
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const helpRequest = {
            id: 17,
            requesterEmail: "blah@ucsb.edu",
            teamId: "s23-7pm-4",
            tableOrBreakoutRoom: "5",
            requestTime: "2022-04-20T17:35",
            explanation: "blah",
            solved: false
        };

        axiosMock.onPost("/api/HelpRequest/post").reply( 202, helpRequest );

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("HelpRequestForm-requesterEmail")).toBeInTheDocument();
        });

        const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
        const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
        const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
        const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
        const explanationField = screen.getByTestId("HelpRequestForm-explanation");
        const solvedField = screen.getByTestId("HelpRequestForm-solved");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: 'blah@ucsb.edu' } });
        fireEvent.change(teamIdField, { target: { value: 's23-7pm-4' } });
        fireEvent.change(tableOrBreakoutRoomField, { target: { value: '5' } });
        fireEvent.change(requestTimeField, { target: { value: '2022-04-20T17:35' } });
        fireEvent.change(explanationField, { target: { value: 'blah' } });
        fireEvent.change(solvedField, { target: { value: false } });
        
        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "requesterEmail": "blah@ucsb.edu",
            "teamId": "s23-7pm-4",
            "tableOrBreakoutRoom": "5",
            "requestTime": "2022-04-20T17:35",
            "explanation": "blah",
            "solved": "false"
        });

        expect(mockToast).toBeCalledWith("New helpRequest Created - id: 17 requesterEmail: blah@ucsb.edu");
        expect(mockNavigate).toBeCalledWith({ "to": "/HelpRequest" });
    });


});
