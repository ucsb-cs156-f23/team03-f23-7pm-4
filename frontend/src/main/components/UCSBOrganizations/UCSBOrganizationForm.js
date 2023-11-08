import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function UCSBOrganizationForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    
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

    const testIdPrefix = "UCSBOrganizationForm";

    return (
        <Form onSubmit={handleSubmit(submitAction)}>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="orgCode">Organization Code</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-orgCode"}
                    id="orgCode"
                    type="text"
                    isInvalid={Boolean(errors.orgCode)}
                    {...register("orgCode", {
                        required: "Org code is required.",
                        maxLength : {
                            value: 4,
                            message: "Max length 4 characters"
                        }
                    })}
                    disabled={initialContents}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.orgCode?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="translation">Organization Translation</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-translation"}
                    id="translation"
                    type="text"
                    isInvalid={Boolean(errors.translation)}
                    {...register("translation", {
                        required: "Org translation is required.",
                        maxLength : {
                            value: 100,
                            message: "Max length 100 characters"
                        }
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.translation?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="translationShort">Short Translation</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-translationShort"}
                    id="translationShort"
                    type="text"
                    isInvalid={Boolean(errors.translationShort)}
                    {...register("translationShort", {
                        required: "Short translation is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.translationShort?.message}
                </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="inactive">Inactive</Form.Label>
                <Form.Switch
                    data-testid={testIdPrefix + "-inactive"}
                    id="inactive"
                    type="select"
                    {...register("inactive", {
                        required: false
                    })}
                />
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

export default UCSBOrganizationForm;