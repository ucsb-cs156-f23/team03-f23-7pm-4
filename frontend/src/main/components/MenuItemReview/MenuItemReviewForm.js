import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function MenuItemReviewForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all

    const navigate = useNavigate();

    // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
    // Note that even this complex regex may still need some tweaks

    // Stryker disable next-line Regex
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;

    // Stryker disable next-line all
    //const yyyyq_regex = /((19)|(20))\d{2}[1-4]/i; // Accepts from 1900-2099 followed by 1-4.  Close enough.
    const testIdPrefix = "MenuItemReviewForm";

    return (

        <Form onSubmit={handleSubmit(submitAction)}>

                {initialContents && (
                        <Form.Group className="mb-3" >
                            <Form.Label htmlFor="id">id</Form.Label>
                            <Form.Control
                                data-testid={testIdPrefix + "-id"}
                                id="id"
                                type="text"
                                {...register("id")}
                                value={initialContents.id}
                                disabled
                            />
                        </Form.Group>
                )}

                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="itemId">itemId</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-itemId"}
                        id="itemId"
                        type="text"
                        isInvalid={Boolean(errors.itemId)}
                        {...register("itemId", {
                            required: "ItemId is required.",
                        })}
                        />
                        <Form.Control.Feedback type="invalid">
                        {errors.itemId?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                <Form.Group className="mb-3" >
                <Form.Label htmlFor="reviewerEmail">reviewerEmail</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-reviewerEmail"}
                    id="reviewerEmail"
                    type="text"
                    isInvalid={Boolean(errors.itemId)}
                    {...register("reviewerEmail", {
                        required: "Reviewer email is required.",
                    })}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.reviewerEmail?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" >
                <Form.Label htmlFor="stars">stars</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-stars"}
                    id="stars"
                    type="text"
                    isInvalid={Boolean(errors.itemId)}
                    {...register("stars", {
                        required: "Stars are required.",
                    })}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.stars?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" >
                        <Form.Label htmlFor="dateReviewed">dateReviewed</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix +"-dateReviewed"}
                            id="dateReviewed"
                            type="text"
                            isInvalid={Boolean(errors.dateReviewed)}
                            {...register("dateReviewed", { required: true, pattern: isodate_regex })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.dateReviewed && 'Date reviewed is required.'}
                        </Form.Control.Feedback>
                    </Form.Group>

                <Form.Group className="mb-3" >
                <Form.Label htmlFor="comments">comments</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-comments"}
                    id="comments"
                    type="text"
                    isInvalid={Boolean(errors.description)}
                    {...register("comments", {
                        required: "Comments are required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                {errors.comments?.message}
                </Form.Control.Feedback>
            </Form.Group>


            <Button
                type="submit"
                data-testid={testIdPrefix + "-submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>

        </Form>

    )
}

export default MenuItemReviewForm;