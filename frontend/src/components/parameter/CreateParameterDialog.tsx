import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { DialogHeader } from "../ui/dialog";
import CreateParameterForm from "./CreateParameterForm";
import { Pen } from "lucide-react";
import DeleteDialog from "../DeleteDialog";

interface CreateParameterDialogProps {
  isCreate?: boolean;
  id?: number;
  score_sheet_id?: number;
  name?: string;
  rule_type?: string;
  is_special_parameter?: string;
  special_scores_rule?: string;
  special_length_rule?: string;
  score_weight?: number;
  length_weight?: number;
  btn_ClassName?: string;
  btn_Variant?: "default" | "outline" | "ghost" | "secondary" | "destructive";
}

const CreateParameterDialog: React.FC<CreateParameterDialogProps> = ({
  isCreate = true,
  id = undefined,
  score_sheet_id = undefined,
  name = "",
  rule_type = "",
  is_special_parameter = "",
  special_scores_rule = "",
  special_length_rule = "",
  score_weight = 1.0,
  length_weight = 1.0,
  btn_ClassName = "",
  btn_Variant = "default",
}) => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={btn_Variant} className={btn_ClassName} type="button">
            {isCreate ? "Create Parameter" : <Pen />}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isCreate ? "Create Parameter" : "Edit Parameter"}
            </DialogTitle>
            <DialogDescription>
              {isCreate
                ? "Fill in the details to create a new parameter."
                : "Edit the details of the selected parameter."}
            </DialogDescription>
          </DialogHeader>

          <CreateParameterForm
            isCreate={isCreate}
            id={id}
            score_sheet_id={score_sheet_id}
            name={name}
            rule_type={rule_type}
            is_special_parameter={is_special_parameter}
            special_scores_rule={special_scores_rule}
            special_length_rule={special_length_rule}
            score_weight={score_weight}
            length_weight={length_weight}
          />

          {!isCreate && (
            <DialogFooter className="mr-5 mt-0 pt-0">
              <DeleteDialog
                id={id ?? 0}
                uri="delete_parameter"
                deleteItem="parameter"
              />
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateParameterDialog;
