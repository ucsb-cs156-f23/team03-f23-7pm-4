import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import ArticlesForm from "main/components/Articles/ArticlesForm";
import { articlesFixtures } from "fixtures/articlesFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("ArticlesForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <ArticlesForm />
            </Router>
        );
        await screen.findByText(/Title/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in an Article", async () => {

        render(
            <Router  >
                <ArticlesForm initialContents={articlesFixtures.oneArticle} />
            </Router>
        );
        await screen.findByTestId(/ArticlesForm-id/);
        expect(screen.getByText(`Id`)).toBeInTheDocument();
        expect(screen.getByTestId(/ArticlesForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <ArticlesForm />
            </Router>
        );
        await screen.findByTestId("ArticlesForm-title");
        const localDateTimeField = screen.getByTestId("ArticlesForm-localDateTime");
        const submitButton = screen.getByTestId("ArticlesForm-submit");

        fireEvent.change(localDateTimeField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <ArticlesForm />
            </Router>
        );
        await screen.findByTestId("ArticlesForm-submit");
        const submitButton = screen.getByTestId("ArticlesForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Title is required./);
        expect(screen.getByText(/URL is required./)).toBeInTheDocument();
        expect(screen.getByText(/Email is required./)).toBeInTheDocument();
        expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
        expect(screen.getByText(/LocalDateTime is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();
    
        render(
            <Router  >
                <ArticlesForm submitAction={mockSubmitAction} />
            </Router>
        );
    
        await screen.findByTestId("ArticlesForm-title");
    
        const titleField = screen.getByTestId("ArticlesForm-title");
        const urlField = screen.getByTestId("ArticlesForm-url");
        const explanationField = screen.getByTestId("ArticlesForm-explanation");
        const emailField = screen.getByTestId("ArticlesForm-email");
        const localDateTimeField = screen.getByTestId("ArticlesForm-localDateTime");
        const submitButton = screen.getByTestId("ArticlesForm-submit");
    
        fireEvent.change(titleField, { target: { value: 'fishtitle' } });
        fireEvent.change(urlField, { target: { value: 'fishes.com' } });
        fireEvent.change(explanationField, { target: { value: 'fish stuff' } });
        fireEvent.change(emailField, { target: { value: 'fishes@gmail.com' } });
        fireEvent.change(localDateTimeField, { target: { value: '2003-01-12T20:20:20' } });
        fireEvent.click(submitButton);
    
        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
    
        expect(screen.queryByText(/localDateTime must be in ISO format/)).not.toBeInTheDocument();
    });
    
    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <ArticlesForm />
            </Router>
        );
        await screen.findByTestId("ArticlesForm-cancel");
        const cancelButton = screen.getByTestId("ArticlesForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


