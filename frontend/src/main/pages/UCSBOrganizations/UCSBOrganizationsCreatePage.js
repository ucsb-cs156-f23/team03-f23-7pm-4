import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBOrganizationForm from "main/components/UCSBOrganizations/UCSBOrganizationForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationsCreatePage({storybook=false}) {

  const objectToAxiosParams = (ucsbOrganization) => ({
    url: "/api/ucsborganizations/post",
    method: "POST",
    params: {
      orgCode: ucsbOrganization.orgCode,
      orgTranslation: ucsbOrganization.orgTranslation,
      orgTranslationShort: ucsbOrganization.orgTranslationShort,
      inactive: ucsbOrganization.inactive
    }
  });

  const onSuccess = (ucsbOrganization) => {
    toast(`New ucsbOrganization Created - code: ${ucsbOrganization.orgCode} translation: ${ucsbOrganization.orgTranslation}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/ucsborganizations/all"]
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/ucsborganizations" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New UCSBOrganization</h1>

        <UCSBOrganizationForm submitAction={onSubmit} />

      </div>
    </BasicLayout>
  )
}