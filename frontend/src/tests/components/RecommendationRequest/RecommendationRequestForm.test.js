import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("RecommendationRequestForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        await screen.findByText(/requesterEmail/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a RecommendationRequest", async () => {

        render(
            <Router  >
                <RecommendationRequestForm initialContents={recommendationRequestFixtures.oneRecommendationRequest} />
            </Router>
        );
        await screen.findByTestId(/RecommendationRequestForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/RecommendationRequestForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestForm-dateRequested");
        const requesterEmailField = screen.getByTestId("RecommendationRequestForm-dateRequested");
        const professorEmailField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: 'bad-input' } });
        fireEvent.change(professorEmailField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await screen.findByText(/DateRequested is required./);
        expect(screen.getByText(/requesterEmail is required./)).toBeInTheDocument();
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestForm-submit");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/requesterEmail is required./);
        expect(screen.getByText(/requesterEmail is required./)).toBeInTheDocument();
        expect(screen.getByText(/professorEmail is required./)).toBeInTheDocument();
        expect(screen.getByText(/explanation is required./)).toBeInTheDocument();
        expect(screen.getByText(/Done is required./)).toBeInTheDocument();
    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <RecommendationRequestForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestForm-requesterEmail");

        const requesterEmail = screen.getByTestId("RecommendationRequestForm-requesterEmail");
        const professorEmail = screen.getByTestId("RecommendationRequestForm-professorEmail");
        const dateRequested = screen.getByTestId("RecommendationRequestForm-dateRequested");
        const dateNeeded = screen.getByTestId("RecommendationRequestForm-dateNeeded");
        const explanation = screen.getByTestId("RecommendationRequestForm-explanation");
        const done = screen.getByTestId("RecommendationRequestForm-done");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

        fireEvent.change(requesterEmail, { target: { value: 'chris@ucsb.edu' } });
        fireEvent.change(professorEmail, { target: { value: 'conrad@ucsb.edu' } });
        fireEvent.change(dateRequested, { target: { value: '2022-01-02T12:00:00' } });
        fireEvent.change(explanation, { target: { value: 'I need a recommendation' } });
        fireEvent.change(done, { target: { value: 'true' } });

        fireEvent.click(submitButton);

        //await waitFor(() => expect(screen.getByText(/DateNeeded is required./)).toBeInTheDocument());
        const temp = await screen.findByText(/DateNeeded is required./);
        //expect(screen.getByText(/DateNeeded is required./)).toBeInTheDocument()
        expect(temp).toBeInTheDocument()
        fireEvent.change(dateNeeded, { target: { value: '2022-02-02T12:00:00' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
        expect(screen.queryByText(/requesterEmail is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/professorEmail is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/explanation is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/DateNeeded is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/DateRequested is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Done is required./)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestForm-cancel");
        const cancelButton = screen.getByTestId("RecommendationRequestForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


