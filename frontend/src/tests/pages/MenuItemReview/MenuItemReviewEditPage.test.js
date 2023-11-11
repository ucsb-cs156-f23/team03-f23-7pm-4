import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";

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
            id: 1
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("MenuItemReviewEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/menuitemreview", { params: { id: 1 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit MenuItemReview");
            expect(screen.queryByTestId("MenuItemReview-itemId")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/menuitemreview", { params: { id: 1 } }).reply(200, {
                id: 1,
                itemId: "27",
                reviewerEmail: "cgaucho@ucsb.edu",
                stars: "3",
                dateReviewed: "2022-04-20T12:00:00",
                comments: "bland af but edible I guess"
            });
            axiosMock.onPut('/api/menuitemreview').reply(200, {
                id: 1,
                itemId: "26",
                reviewerEmail: "agaucho@ucsb.edu",
                stars: "2",
                dateReviewed: "2022-04-20T12:00:00",
                comments: "okay"
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemReviewForm-id");

            const idField = screen.getByTestId("MenuItemReviewForm-id");
            const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
            const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
            const starsField = screen.getByTestId("MenuItemReviewForm-stars");
            const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
            const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
            const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("1");
            expect( itemIdField).toBeInTheDocument();
            expect(itemIdField).toHaveValue("27");
            expect(reviewerEmailField).toBeInTheDocument();
            expect(reviewerEmailField).toHaveValue("cgaucho@ucsb.edu");
            expect(starsField).toBeInTheDocument();
            expect(starsField).toHaveValue("3");
            expect(dateReviewedField).toBeInTheDocument();
            expect(dateReviewedField).toHaveValue("2022-04-20T12:00:00");
            expect(commentsField).toBeInTheDocument();
            expect(commentsField).toHaveValue("bland af but edible I guess");

            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(itemIdField, { target: { value: '26' } });
            fireEvent.change(reviewerEmailField, { target: { value: 'agaucho@ucsb.edu' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("MenuItemReview Updated - id: 1 itemId: 26 reviewerEmail: agaucho@ucsb.edu stars: 2 dateReviewed: 2022-04-20T12:00:00 comments: okay");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreview" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 1 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                itemId: '26',
                reviewerEmail: 'agaucho@ucsb.edu',
                stars: '3',
                dateReviewed: "2022-04-20T12:00:00",
                comments: "bland af but edible I guess"

            })); // posted object


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemReviewForm-id");

            const idField = screen.getByTestId("MenuItemReviewForm-id");
            const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
            const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
            const starsField = screen.getByTestId("MenuItemReviewForm-stars");
            const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
            const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
            const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

            expect(idField).toHaveValue("1");
            expect(itemIdField).toHaveValue("27");
            expect(reviewerEmailField).toHaveValue("cgaucho@ucsb.edu");
            expect(starsField).toHaveValue("3");
            expect(dateReviewedField).toHaveValue("2022-04-20T12:00:00");
            expect(commentsField).toHaveValue("bland af but edible I guess")
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(itemIdField, { target: { value: '26' } })
            fireEvent.change(reviewerEmailField, { target: { value: 'agaucho@ucsb.edu' } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("MenuItemReview Updated - id: 1 itemId: 26 reviewerEmail: agaucho@ucsb.edu stars: 2 dateReviewed: 2022-04-20T12:00:00 comments: okay");
            expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreview" });
        });

       
    });
});
