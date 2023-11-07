// import { render, waitFor, fireEvent, screen } from "@testing-library/react";
// import RecommendationRequest from "main/components/RecommendationRequest/RecommendationRequestForm";
// import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
// import { BrowserRouter as Router } from "react-router-dom";

// const mockedNavigate = jest.fn();

// jest.mock('react-router-dom', () => ({
//     ...jest.requireActual('react-router-dom'),
//     useNavigate: () => mockedNavigate
// }));


// describe("RecommendationRequestForm tests", () => {

//     test("renders correctly", async () => {

//         render(
//             <Router  >
//                 <RecommendationRequestForm />
//             </Router>
//         );
//         await screen.findByText(/requesterEmail/);
//         await screen.findByText(/Create/);
//     });


//     test("renders correctly when passing in a RecommendationRequest", async () => {

//         render(
//             <Router  >
//                 <RecommendationRequestForm initialContents={recommendationRequestFixtures.oneDate} />
//             </Router>
//         );
//         await screen.findByTestId(/RecommendationRequestForm-id/);
//         expect(screen.getByText(/Id/)).toBeInTheDocument();
//         expect(screen.getByTestId(/RecommendationRequestForm-id/)).toHaveValue("1");
//     });


//     test("Correct Error messsages on bad input", async () => {

//         render(
//             <Router  >
//                 <RecommendationRequestForm />
//             </Router>
//         );
//         await screen.findByTestId("RecommendationRequestForm-requesterEmail");
//         const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
//         const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
//         const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

//         fireEvent.change(requesterEmailField, { target: { value: 'bad-input' } });
//         fireEvent.change(professorEmailField, { target: { value: 'bad-input' } });
//         fireEvent.click(submitButton);

//         await screen.findByText(/QuarterYYYYQ must be in the format YYYYQ/);
//     });

//     test("Correct Error messsages on missing input", async () => {

//         render(
//             <Router  >
//                 <UCSBDateForm />
//             </Router>
//         );
//         await screen.findByTestId("UCSBDateForm-submit");
//         const submitButton = screen.getByTestId("UCSBDateForm-submit");

//         fireEvent.click(submitButton);

//         await screen.findByText(/requesterEmail is required./);
//         expect(screen.getByText(/requesterEmail is required./)).toBeInTheDocument();
//         expect(screen.getByText(/explanation is required./)).toBeInTheDocument();

//     });

//     test("No Error messsages on good input", async () => {

//         const mockSubmitAction = jest.fn();


//         render(
//             <Router  >
//                 <UCSBDateForm submitAction={mockSubmitAction} />
//             </Router>
//         );
//         await screen.findByTestId("UCSBDateForm-quarterYYYYQ");

//         const quarterYYYYQField = screen.getByTestId("UCSBDateForm-quarterYYYYQ");
//         const nameField = screen.getByTestId("UCSBDateForm-name");
//         const localDateTimeField = screen.getByTestId("UCSBDateForm-localDateTime");
//         const submitButton = screen.getByTestId("UCSBDateForm-submit");

//         fireEvent.change(quarterYYYYQField, { target: { value: '20221' } });
//         fireEvent.change(nameField, { target: { value: 'noon on January 2nd' } });
//         fireEvent.change(localDateTimeField, { target: { value: '2022-01-02T12:00' } });
//         fireEvent.click(submitButton);

//         await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

//         expect(screen.queryByText(/QuarterYYYYQ must be in the format YYYYQ/)).not.toBeInTheDocument();
//         expect(screen.queryByText(/localDateTime must be in ISO format/)).not.toBeInTheDocument();

//     });


//     test("that navigate(-1) is called when Cancel is clicked", async () => {

//         render(
//             <Router  >
//                 <UCSBDateForm />
//             </Router>
//         );
//         await screen.findByTestId("UCSBDateForm-cancel");
//         const cancelButton = screen.getByTestId("UCSBDateForm-cancel");

//         fireEvent.click(cancelButton);

//         await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

//     });

// });


